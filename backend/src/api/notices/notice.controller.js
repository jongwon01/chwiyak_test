import * as noticeService from "./notice.service.js";

// 전체 목록 조회
export const getNotices = async (req, res) => {
  try {
    const notices = await noticeService.getAll();
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 단일 조회
export const getNotice = async (req, res) => {
  try {
    const notice = await noticeService.getById(req.params.id);
    res.status(200).json(notice);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// 등록 (관리자만)
export const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNotice = await noticeService.create(title, content, req.admin.admin_id);
    res.status(201).json({ message: "공지 등록 완료", data: newNotice });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 수정 (관리자만)
export const updateNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updated = await noticeService.update(req.params.id, title, content);
    res.status(200).json({ message: "공지 수정 완료", data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 삭제 (관리자만)
export const deleteNotice = async (req, res) => {
  try {
    await noticeService.remove(req.params.id);
    res.status(200).json({ message: "공지 삭제 완료" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
