
const baseRoute = `${process.env.NEXT_PUBLIC_DOMAIN}/api`;

export const ADMIN_API_ROUTES={
    LOGIN:`${baseRoute}/admin/login`,
    CREATE_JOB:`${baseRoute}/admin/create-job`,
    JOB_DETAILS:`${baseRoute}/admin/job-details`,
    DASHBOARD_SCRAPING_CHART_DATA: `${baseRoute}/admin/dashboard/scraping-chart-data`,
    DASHBOARD_METRICS: `${baseRoute}/admin/dashboard/metrics`,
}


export const USER_API_ROUTES = {
     GET_ALL_TRIPS:`${baseRoute}/all-trips`,
     GET_CITY_TRIPS:`${baseRoute}/city-trips`,
     GET_TRIP_DATA:`${baseRoute}/tripData`,
     SIGNUP: `${baseRoute}/auth/signup`,
     LOGIN: `${baseRoute}/auth/login`,
     ME:`${baseRoute}/auth/me`,
     CREATE_BOOKING:`${baseRoute}/booking`,
     GET_USER_BOOKINGS:`${baseRoute}/booking/get-bookings`,
     FLIGHT_SCRAPE:`${baseRoute}/flights/scrape`,
     FLIGHT_SCRAPE_STATUS:`${baseRoute}/flights/scrape-status`,
     HOTEL_SCRAPE:`${baseRoute}/hotels/scrape`,
     HOTEL_SCRAPE_STATUS:`${baseRoute}/hotels/scrape-status`,
     GET_ALL_HOTELS: `${baseRoute}/all-hotels`,
     GET_ALL_BOOKINGS: `${baseRoute}/booking`,

}