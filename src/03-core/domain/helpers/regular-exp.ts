const regularExps = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  username: /^(?![_\.])(?!.*[_\.]{2})[a-zA-Z0-9_.]{5,30}(?<![_\.])$/,
};
export default regularExps;
