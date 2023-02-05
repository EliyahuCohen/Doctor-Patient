import { useEffect, useState } from "react";
import { User } from "../../types/type";
import "./app.scss";
const Admin = () => {
  const [users,setUsers]=useState<User[]>([])
  const [selected,setSelected]=useState<number>(0)
  useEffect(()=>{
     //calling a hook to get the data about users
  },[])
  return (
    <div className="admin">
      <div className="tags">
        <p className={`${selected==0?"selected":""}`} onClick={()=>setSelected(0)}>Doctors</p>
        <p className={`${selected==1?"selected":""}`} onClick={()=>setSelected(1)}>Patients</p>
      </div>
    </div>
  );
};

export default Admin;
