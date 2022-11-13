import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const responseObj = {
  get: "fixtures",
  parameters: { league: "39", date: "2022-11-13", season: "2022" },
  errors: [],
  results: 2,
  paging: { current: 1, total: 1 },
  response: [
    {
      fixture: {
        id: 868097,
        referee: "C. Kavanagh",
        timezone: "UTC",
        date: "2022-11-13T14:00:00+00:00",
        timestamp: 1668348000,
        periods: { first: null, second: null },
        venue: {
          id: 508,
          name: "The American Express Community Stadium",
          city: "Falmer, East Sussex",
        },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 39,
        name: "Premier League",
        country: "England",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        flag: "https://media.api-sports.io/flags/gb.svg",
        season: 2022,
        round: "Regular Season - 16",
      },
      teams: {
        home: {
          id: 51,
          name: "Brighton",
          logo: "https://media.api-sports.io/football/teams/51.png",
          winner: null,
        },
        away: {
          id: 66,
          name: "Aston Villa",
          logo: "https://media.api-sports.io/football/teams/66.png",
          winner: null,
        },
      },
      goals: { home: null, away: null },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 868098,
        referee: "P. Tierney",
        timezone: "UTC",
        date: "2022-11-13T16:30:00+00:00",
        timestamp: 1668357000,
        periods: { first: null, second: null },
        venue: { id: 535, name: "Craven Cottage", city: "London" },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 39,
        name: "Premier League",
        country: "England",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        flag: "https://media.api-sports.io/flags/gb.svg",
        season: 2022,
        round: "Regular Season - 16",
      },
      teams: {
        home: {
          id: 36,
          name: "Fulham",
          logo: "https://media.api-sports.io/football/teams/36.png",
          winner: null,
        },
        away: {
          id: 33,
          name: "Manchester United",
          logo: "https://media.api-sports.io/football/teams/33.png",
          winner: null,
        },
      },
      goals: { home: null, away: null },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
  ],
};
const fixture1 = responseObj.response[1];
const home = fixture1.teams.home,
  away = fixture1.teams.away,
  awayLogo = away.logo,
  homeLogo = home.logo,
  status = fixture1.fixture.status.long,
  venue = fixture1.fixture.venue.name,
  time = new Date(fixture1.fixture.timestamp * 1000).toLocaleTimeString();

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const fixture = `${home.name} vs ${away.name}`;
const imgSrc = awayLogo;
const dateOfFixture = `Your time:${time}`;
const fixtureSecondary = `Status: ${status}`;
const Venue = "Venue: " + venue;
export default function FixtureCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={fixture}
        subheader={dateOfFixture}
      />
      <CardMedia component="img" height="194" image={imgSrc} alt={fixture} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {fixtureSecondary}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{Venue}</Typography>
        </CardContent>
      </Collapse>
      <FontAwesomeIcon icon="fa-brands fa-whatsapp" />
    </Card>
  );
}
