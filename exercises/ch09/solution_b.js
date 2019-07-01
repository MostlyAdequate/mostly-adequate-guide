const basename = compose(last, split('/'));

const logFilename = compose(chain(pureLog), map(basename))(getFile);
