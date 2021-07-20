import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error, mutate } = useSWR("/api/user", fetcher, {
    // change to false when debugging will make things easier
    // certain components rerender on gaining focus ....
    // must be this way revalidateOnFocus: true for our loggin to work
    // as user does not get updated without it or a refresh
    revalidateOnFocus: true,
  });
  const user = data?.user ? data.user : null;
  const finished = Boolean(data);
  const hasUser = Boolean(user);
  console.log("user hook data", data, "user hook data.user", data?.user);
  if (user) {
    user.logout = async () => {
      console.log("logging out from useUser");
      await mutate(fetch("/api/logout"));
      //Router.push("/");
    };
  }
  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return error ? null : user;
}
