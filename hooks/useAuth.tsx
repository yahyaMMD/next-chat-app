import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

let logoutTimer: any | number;

export const useAuth = () => {
  const [token, settoken] = useState<null | string>(null);
  const [tokenExp, settokenExp] = useState<null | Date>();
  const router = useRouter();

  const login = useCallback((token: any, expirationDate?: Date) => {
    settoken(token);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    settokenExp(tokenExpirationDate);

    localStorage.setItem(
      "userdata",
      JSON.stringify({
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    settoken(null);
    settokenExp(null);
    localStorage.removeItem("userdata");
    localStorage.removeItem("userinfo");
    router.replace("/login");
  }, []);

  useEffect(() => {
    if (token && tokenExp) {
      const remainingTime = tokenExp.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExp]);

  return { token, login, logout };
};
