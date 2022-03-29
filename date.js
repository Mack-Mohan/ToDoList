const options={
  weekday:'long',
  day:"numeric",
  month:"long"
};
let today = new Date();

exports.date = today.toLocaleDateString("en-US",options);
exports.day = today.toLocaleDateString("en-US",{weekday:'long'});
