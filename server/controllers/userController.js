import sql from "../configs/db.js";

export const getUserResumes = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resumes = await sql`
      SELECT * FROM resumes WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.json({ success: true, resumes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
