import Session from "../models/Session";

export const createOrUpdateSession = async ({
  userId,
  wordId,
  word,
  attempt,
}) => {
  const session = await Session.findOne({
    userId,
    wordId,
  });

  if (session) {
    session.attempts.push(attempt);

    await session.save();

    return session;
  }

  const newSession = await Session.create({
    userId,
    wordId,
    word,
    attempts: [attempt],
  });

  return newSession;
};


export const getSessionByUserAndWord = async ({
  userId,
  wordId,
}) => {
  return await Session.findOne({
    userId,
    wordId,
  });
};