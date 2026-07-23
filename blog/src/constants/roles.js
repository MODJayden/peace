export const USER_ROLES = Object.freeze({
  VISITOR: "visitor",
  SUBSCRIBER: "subscriber",
  AUTHOR: "author",
  EDITOR: "editor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
});

export const ROLE_HIERARCHY = [
  USER_ROLES.VISITOR,
  USER_ROLES.SUBSCRIBER,
  USER_ROLES.AUTHOR,
  USER_ROLES.EDITOR,
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER_ADMIN,
];

export const CATEGORY_NAMES = [
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Education",
  "Health",
  "Lifestyle",
  "Opinion",
  "World News",
];
