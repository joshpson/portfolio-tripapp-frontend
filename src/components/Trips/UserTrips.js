import React from "react";
import { Link } from "react-router-dom";

import { Card, Icon, Image } from "semantic-ui-react";
import Moment from "react-moment";
import RailsApi from "../RailsApi";

class UserTrips extends React.Component {
  constructor(props) {
    super(props);
  }

  activeTrips = () => {
    return this.props.trips.filter(trip => trip.status === true);
  };

  archiveTrip = tripId => {
    RailsApi.archiveTrip(tripId).then(res => {
      this.props.updateTrips();
    });
  };

  render() {
    return (
      <div>
        {this.activeTrips().length > 0 ? (
          <Card.Group>
            {this.activeTrips().map(trip => (
              <Card key={trip.id}>
                <Image src={trip.image} />
                <Card.Content>
                  <Card.Header>
                    <Link to={`/trips/${trip.id}`}>{trip.city}</Link>
                  </Card.Header>
                  <Card.Meta>
                    <Moment date={trip.start_date} format="ddd MMM D, YYYY" />
                  </Card.Meta>
                  <Card.Description>
                    <Icon name="food" />
                    {trip.bookmarks.length === 1
                      ? `${trip.bookmarks.length} Restaurant Bookmarked`
                      : `${trip.bookmarks.length} Restaurants Bookmarked`}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a onClick={() => this.archiveTrip(trip.id)}>Archive</a>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        ) : (
          <h2>
            You have no active trips.{" "}
            <Link to="/create-trip">You can add one here.</Link>
          </h2>
        )}
      </div>
    );
  }
}

export default UserTrips;
