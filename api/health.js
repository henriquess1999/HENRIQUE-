// Health endpoint: Firebase removed
module.exports = async (req, res) => {
  res.status(200).json({ status: 'ok', firestore: false, note: 'Firebase removed' });
};
