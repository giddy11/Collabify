const onlyAdminAccess = async (req, res, next) => {
    try {
     console.log(req.user.role);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required!",
        });
      }
  
      if (req.user.role !== 1) { // Assuming 1 represents admin role
        return res.status(403).json({
          success: false,
          message: "You don't have permission to access this route!",
        });
      }
  
      next();
    } catch (error) {
      console.error("Error in admin middleware:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong!",
      });
    }
  };
  
  module.exports = { onlyAdminAccess };  