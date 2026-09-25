import { useSelector } from 'react-redux';
import styles from '../../styles/styles'
import EventCard from "./EventCard";
import { EventCardSkeleton } from "../Skeleton/Skeletons";

const Events = () => {
  const {allEvents,isLoading} = useSelector((state) => state.events);
  const loading = isLoading && !allEvents;

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>

        <div className="w-full grid">
          {loading && <EventCardSkeleton />}
          {!loading && allEvents?.length > 0 && (
            <EventCard data={allEvents[0]} />
          )}
          {!loading && !allEvents?.length && (
            <h4>No Events have!</h4>
          )}
        </div>
      </div>
    </div>
  )
}

export default Events
