export function filterStudents(students, search, status) {
  // Challenge 1: implement immutable name/email search and status filtering.
  return students.filter((ele) => {
    //  if(ele?.name?.toLowerCase().includes(search?.toLowerCase() || ele?.status==status))
    //    return true;

    if (status == "All statuses") {
      if (
        ele?.name
          ?.toLowerCase()
          .includes(search?.toLowerCase())
      )
        return true;
    } else if(search==""){
      if(ele.status==status){
        return true
      }
    }else{
        if(ele?.name?.toLowerCase().includes(search?.toLowerCase()) && ele?.status==status)
       return true;
    }
  });
}
