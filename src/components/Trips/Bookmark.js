import React from "react";
import { Icon, Item, Label } from "semantic-ui-react";
import _ from "lodash";
import YelpPhotos from "../YelpSearch/YelpPhotos";

const YelpSearchCard = ({ result, showDirections }) => (
  <Item>
    <Item.Image size="small" src={result.image_url} verticalAlign="middle" />
    <Item.Content verticalAlign="middle">
      <Item.Header as="a" href={result.url}>
        {result.name}
      </Item.Header>
      <Item.Meta>
        {_.times(Math.round(result.rating), () => (
          <Icon color="yellow" name="star" />
        ))}
      </Item.Meta>
      <Item.Description>
        {result.location.display_address[0]} <br />{" "}
        {result.location.display_address[1]}
        <br />
        {result.display_phone}
        <YelpPhotos id={result.id} />
      </Item.Description>
      <Item.Extra>
        <Label
          as="a"
          onClick={() => showDirections(result)}
          icon="map outline"
          content={`${Math.round(result.distance * 10) / 10} miles`}
        />
      </Item.Extra>
    </Item.Content>
  </Item>
);

export default YelpSearchCard;
