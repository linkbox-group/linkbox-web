import { useState, useEffect } from "react";

export const useLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth < 768
  );
  const [columns, setColumns] = useState(
    window.innerWidth < 640
      ? 1
      : window.innerWidth < 1024
      ? 2
      : window.innerWidth < 1280
      ? 3
      : 4
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
      setColumns(
        window.innerWidth < 640
          ? 1
          : window.innerWidth < 1024
          ? 2
          : window.innerWidth < 1920
          ? 3
          : 4
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    columns,
  };
};
