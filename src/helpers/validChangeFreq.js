module.exports = desiredChangeFreq => {
  const acceptedChangeFreqs = [
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never'
  ];
  if (acceptedChangeFreqs.indexOf(desiredChangeFreq) === -1) {
    return '';
  }
  return desiredChangeFreq;
};
