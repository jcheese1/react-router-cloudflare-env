export const LIST = () => {
	return ["a", "b", "c", ...(ENV.PUBLIC_ENV ? ["d"] : [])];
};
