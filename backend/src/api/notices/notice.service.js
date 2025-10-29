import * as noticeModel from "./notice.model.js";

export const getAll = async () => {
  return await noticeModel.getAllNotices();
};

export const getById = async (id) => {
  const notice = await noticeModel.getNoticeById(id);
  if (!notice) throw new Error("해당 공지를 찾을 수 없습니다.");
  return notice;
};

export const create = async (title, content, adminId) => {
  if (!title || !content) throw new Error("제목과 내용을 모두 입력해야 합니다.");
  const newId = await noticeModel.createNotice(title, content, adminId);
  return await noticeModel.getNoticeById(newId);
};

export const update = async (id, title, content) => {
  const success = await noticeModel.updateNotice(id, title, content);
  if (!success) throw new Error("공지 수정에 실패했습니다.");
  return await noticeModel.getNoticeById(id);
};

export const remove = async (id) => {
  const success = await noticeModel.deleteNotice(id);
  if (!success) throw new Error("공지 삭제에 실패했습니다.");
  return true;
};
