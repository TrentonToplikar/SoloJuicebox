const { Client } = require("pg");
const client = new Client("postgres://localhost:5432/newjuicebox");

//USERS
const createUser = async ({ username, password, name, location }) => {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO users (username, password, name, location) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
  `,
      [username, password, name, location]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};
const updateUser = async (id, fields = {}) => {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (!setString.length) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
};
const getAllUsers = async () => {
  const { rows } = await client.query(
    `
        SELECT id, username, name, location, active
        FROM users;
        `
  );
  return rows;
};

const getUserById = async (userId) => {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT id, username, name, location, active
      FROM users
      WHERE id=${userId}
    `);
    if (!user) {
      return null;
    } else {
    }
    user.posts = await getPostsByUser(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

//POSTS
const createPost = async ({ authorId, title, content }) => {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
    INSERT INTO posts ("authorId", title, content) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
      [authorId, title, content]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (id, fields = {}) => {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (!setString.length) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

const getAllPosts = async () => {
  try {
    const { rows } = await client.query(
      `
          SELECT id, "authorId", title, content, active
          FROM posts;
          `
    );
    return rows;
  } catch (error) {
    throw error;
  }
};
async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createUser,
  updateUser,
  getAllUsers,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
};
