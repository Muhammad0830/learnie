export function authorizeRoles(allowedRoles: any[]) {
  return (req: any, res: any, next: any) => {
    console.log("req.user", req.user);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
