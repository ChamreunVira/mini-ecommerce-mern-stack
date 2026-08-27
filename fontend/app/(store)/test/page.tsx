"use client";
import { fetchCategories } from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store"
import { useEffect } from "react";

const page = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.categories)
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}

export default page