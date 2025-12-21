// Firebase/Firestore removed: this endpoint is intentionally disabled.
module.exports = async (req, res) => {
  res.status(501).json({ error: 'firebase_removed', message: 'createOrder endpoint disabled because Firebase was removed from the project.' });
};
