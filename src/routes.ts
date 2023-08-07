import wrap from "svelte-spa-router/wrap";
import Loader from "./lib/components/Loader.svelte";

const route = (component: string) => wrap({
    asyncComponent: () => import(`./routes/${component}.svelte`),
    loadingComponent: Loader
});

export default {
    '/': route("Home"),
    '/auth': route("Auth"),
    '*': route("NotFound")
}