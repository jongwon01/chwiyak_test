import db from "../../config/db.js";

export const findAdminByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);
  return rows[0];
};

export const updateAdminToken = async (adminId, token) => {
  await db.query("UPDATE admin SET token = ? WHERE admin_id = ?", [token, adminId]);
};

export const findAdminByToken = async (token) => {
  const [rows] = await db.query("SELECT * FROM admin WHERE token = ?", [token]);
  return rows[0];
};

export const clearAdminToken = async (adminId) => {
  await db.query("UPDATE admin SET token = NULL WHERE admin_id = ?", [adminId]);
};

export const getAdminProfile = async (adminId) => {
  const [rows] = await db.query(
    "SELECT admin_id, username, name, email, phone FROM admin WHERE admin_id = ?",
    [adminId]
  );
  return rows[0];
};