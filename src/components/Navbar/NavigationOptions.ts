export const NavigationOptions = {
  default: [
    {
      name: "Login",
      path: "/login"
    },
    {
      name: "Register",
      path: "/register/students"
    }
  ],
  admin: [
    {
      name: "Courses",
      path: "/courses"
    },
    {
      name: "Admins",
      path: "/admins"
    },
    {
      name: "Register Teacher",
      path: "/register/teachers"
    },
    {
      name: "Logout",
      path: "/logout"
    }
  ],
  student: [
    {
      name: "Courses",
      path: "/courses"
    },
    {
      name: "Logout",
      path: "/logout"
    }
  ],
  teacher: [
    {
      name: "Courses",
      path: "/courses"
    },
    {
      name: "Logout",
      path: "/logout"
    }
  ]
};
