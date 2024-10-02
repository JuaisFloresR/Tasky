import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes where authentication is not required
const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)','/sign-up(.*)']);

// Define routes for OrganizationProfile
const isOrganizationProfileRoute = createRouteMatcher(['/organization/(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isOrganizationProfileRoute(req)) {
    return NextResponse.next();
  }
  // Protect all routes that are not explicitly public
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  // Redirect logic for authenticated users on public routes
  if(auth().userId && isPublicRoute(req)) {
    // Define the default path for organization selection
    let path = "/select-org";

    // If the user has an organization ID, redirect to that specific organization page
    if(auth().orgId){
      path = `/organization/${auth().orgId}`;
    }

    // Create the full URL for redirection
    const orgSelectionUrl = new URL(path, req.url);
    return NextResponse.redirect(orgSelectionUrl);
  }

  // Redirect unauthenticated users trying to access protected routes to the sign-in page
  if(!auth().userId && !isPublicRoute(req)){
    return auth().redirectToSignIn({returnBackUrl: req.url});
  }

  // Redirect authenticated users without an organization to the organization selection page
  if(auth().userId && !auth().orgId && req.nextUrl.pathname !== "/select-org"){
    const orgSelectionUrl = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelectionUrl);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};