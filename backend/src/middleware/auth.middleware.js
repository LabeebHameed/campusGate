export const protectRoute = async (req, res, next) => {
  const auth = req.auth; // Clerk injects req.auth as an object in Express

  if (!auth || !auth.userId) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }

  next();
};

export const protectAdminRoute = async (req, res, next) => {
  const auth = req.auth; // Clerk injects req.auth as an object in Express
  
  if (!auth || !auth.userId) {
    return res.status(401).json({ message: "Unauthorized - not logged in" });
  }
  
  const user = auth.user;
  const userRole = user?.publicMetadata?.role;
  
  if (userRole !== 'admin') {
    return res.status(403).json({ message: "Forbidden - admins only" });
  }
  
  next();
};
