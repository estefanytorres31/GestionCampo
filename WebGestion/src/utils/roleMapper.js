const roleMapper = (roleNumber) => {
    switch (roleNumber) {
      case "admin":
        return 'admin';
      case "administrador":
        return 'administrador';
    //   case 1:
    //     return 'user';
      case "Jefe":
        return 'jefe';
    //   case 1:
    //     return 'encargado';
      default:
        return 'encargado';
    }
  };
  
  export default roleMapper;
  