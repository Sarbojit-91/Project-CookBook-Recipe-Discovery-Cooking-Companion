-- CookBook personal data. Recipe content lives in the app's repository, not here; rows refer to
-- recipes by slug. Every table has row-level security so users can only touch their own rows.

-- ── Profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  dietary_preference text not null default ''
    check (dietary_preference in ('', 'vegetarian', 'vegan', 'pescatarian')),
  week_starts_on smallint not null default 1 check (week_starts_on in (0, 1)),
  created_at timestamptz not null default now()
);

-- Create a profile automatically for every new account.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Shared check for recipe references.
create domain public.recipe_slug as text
  check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) <= 100);

-- ── Favourites ──────────────────────────────────────────────────────────────
create table public.favourites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_slug public.recipe_slug not null,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_slug)
);

-- ── Collections and folders ─────────────────────────────────────────────────
create table public.collection_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.collection_folders (user_id);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  folder_id uuid references public.collection_folders (id) on delete set null,
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  created_at timestamptz not null default now()
);
create index on public.collections (user_id);
create index on public.collections (folder_id);

create table public.collection_recipes (
  collection_id uuid not null references public.collections (id) on delete cascade,
  recipe_slug public.recipe_slug not null,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  primary key (collection_id, recipe_slug)
);

-- ── Notes ───────────────────────────────────────────────────────────────────
create table public.recipe_notes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_slug public.recipe_slug not null,
  body text not null check (char_length(body) between 1 and 5000),
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_slug)
);

-- ── Meal planner ────────────────────────────────────────────────────────────
create table public.meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  week_start date not null,
  day smallint not null check (day between 0 and 6),
  slot text not null check (slot in ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_slug public.recipe_slug not null,
  servings smallint not null check (servings between 1 and 24),
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.meal_plan_entries (user_id, week_start);

-- ── Shopping list ───────────────────────────────────────────────────────────
create table public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  ingredient_id text check (ingredient_id is null or ingredient_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  amounts jsonb not null default '[]'
    check (jsonb_typeof(amounts) = 'array' and jsonb_array_length(amounts) <= 10),
  aisle text not null default 'other' check (aisle in (
    'produce', 'meat-fish', 'dairy-eggs', 'bakery', 'grains-pasta', 'tins-jars', 'spices',
    'baking', 'condiments', 'world-foods', 'frozen', 'drinks', 'other'
  )),
  is_purchased boolean not null default false,
  source_recipe_slugs text[] not null default '{}' check (cardinality(source_recipe_slugs) <= 50),
  created_at timestamptz not null default now()
);
create index on public.shopping_list_items (user_id);

-- ── Row-level security ──────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.favourites enable row level security;
alter table public.collection_folders enable row level security;
alter table public.collections enable row level security;
alter table public.collection_recipes enable row level security;
alter table public.recipe_notes enable row level security;
alter table public.meal_plan_entries enable row level security;
alter table public.shopping_list_items enable row level security;

-- Profiles are created by the trigger and never deleted directly (they go with the account).
create policy "Users read their profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "Users update their profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Tables owned directly through user_id.
do $$
declare t text;
begin
  foreach t in array array[
    'favourites', 'collection_folders', 'collections', 'recipe_notes',
    'meal_plan_entries', 'shopping_list_items'
  ] loop
    execute format(
      'create policy "Users manage their own rows" on public.%I for all to authenticated
         using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
  end loop;
end $$;

-- A collection may only use a folder that belongs to the same user.
create function public.folder_belongs_to_user(folder uuid) returns boolean
language sql stable security invoker set search_path = '' as $$
  select folder is null or exists (
    select 1 from public.collection_folders f where f.id = folder and f.user_id = (select auth.uid())
  );
$$;
alter table public.collections
  add constraint collections_folder_owner check (public.folder_belongs_to_user(folder_id));

-- Collection items are owned through their collection.
create policy "Users manage recipes in their collections" on public.collection_recipes
  for all to authenticated
  using (exists (
    select 1 from public.collections c where c.id = collection_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.collections c where c.id = collection_id and c.user_id = (select auth.uid())
  ));

-- ── Account deletion ────────────────────────────────────────────────────────
-- Lets a signed-in user delete their own account; every table above cascades from auth.users.
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
