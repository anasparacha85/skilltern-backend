
const validate = (schema) => async (req, res, next) => {
  try {
    const parsebody = await schema.parseAsync(req.body);
    req.body = parsebody;
    next();
  } catch (err) {
    console.log('hello', err.issues[0].message);
    const status = 422;
    const FailureMessage = err.issues[0].message;
    const error = { status, FailureMessage };
    next(error);
  }
};

export default validate;
