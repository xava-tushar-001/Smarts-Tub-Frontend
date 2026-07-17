import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { GetProfile } from "../api/api_client";

export default function Home() {
  const [name, setName] = useState("");

  useEffect(() => {
    GetProfile()
      .then((res) => setName(res.data?.body?.user?.name ?? ""))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-1 text-slate-500">
          You are signed in.
        </p>
      </div>

    
    </div>
  );
}
