import * as supportModel from "./support.model.js";

export const getAll = async () => {
  return await supportModel.getAllSupports();
};

export const answerSupport = async (id, answer) => {
  if (!answer || answer.trim() === "") throw new Error("답변 내용을 입력해야 합니다.");

  const support = await supportModel.findSupportById(id);
  if (!support) throw new Error("해당 문의글을 찾을 수 없습니다.");

  const updated = await supportModel.updateAnswer(id, answer);
  if (!updated) throw new Error("답변 등록에 실패했습니다.");

  return {
    message: "답변 등록 완료",
    board_id: id,
    answer,
    status: "ANSWERED",
  };
};