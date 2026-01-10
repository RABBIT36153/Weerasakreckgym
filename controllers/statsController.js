// GET /api/stats - ดึงข้อมูลสถิติทั้งหมด
export const getStats = (req, res) => {
  // In real app, calculate from database
  const stats = {
    totalCourses: 6,
    totalTrainers: 6,
    totalUsers: 45,
    totalRegistrations: 128,
    activeCourses: 6,
    activeTrainers: 6,
    activeUsers: 42,
    pendingRegistrations: 15,
    confirmedRegistrations: 98,
    cancelledRegistrations: 15,
    totalRevenue: 456780,
    monthlyRevenue: 125430,
    todayRegistrations: 5
  };

  res.json(stats);
};

