// Firebase/Firestore removed: orders endpoint disabled
module.exports = async (req, res) => {
  res.status(501).json({ error: 'firebase_removed', message: 'orders endpoint disabled because Firebase was removed.' });
};
