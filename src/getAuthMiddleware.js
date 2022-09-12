const getAuthMiddleware = ({ username, password }) => {

  return (req, res, next) => {
    const reject = () => {
      res.setHeader("www-authenticate", "Basic");
      res.sendStatus(401);
    };

    const authorization = req.headers.authorization;

    if (!authorization) {
      return reject();
    }

    const [providedUsername, providedPassword] = Buffer.from(
      authorization.replace("Basic ", ""),
      "base64"
    )
      .toString()
      .split(":");

    if (!(providedUsername === username && providedPassword === password)) {
      return reject();
    }

    next();
  }
}

module.exports = getAuthMiddleware;
