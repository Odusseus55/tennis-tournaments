import React from "react";
import { Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function TournamnetsByCategoryCard({ tournaments, category }) {
  let headerColor = "";
  if (category === "START") {
    headerColor = "yellow";
  } else if (category === "SPORT") {
    headerColor = "bg-warning";
  } else if (category === "CHALLENGER") {
    headerColor = "bg-danger";
  }
  return (
    <Card className="tournament-tables">
      {category === "START" ? (
        <Card.Header style={{ backgroundColor: headerColor }}>
          <strong>{category}</strong>
        </Card.Header>
      ) : (
        <Card.Header className={headerColor}>
          <strong>{category}</strong>
        </Card.Header>
      )}
      <Table hover className="mb-0 p-0" size="sm">
        <tbody>
          {tournaments.map((tournament, i) => {
            if (tournament.category !== category) {
              return null;
            }
            const date = new Date(tournament.event_date);
            const options = {
              weekday: "short",
              year: undefined,
              month: "short",
              day: "numeric",
            };
            return (
              <tr key={i}>
                <td style={{ width: "20%" }}>
                  {date.toLocaleDateString("cs-CZ", options)}
                </td>
                <td style={{ width: "30%" }}>
                  <Link
                    to={`/tournament/${tournament.id}`}
                    className="text-decoration-none"
                  >
                    {tournament.name}
                  </Link>
                </td>
                <td style={{ width: "10%" }}>{`0/${tournament.capacity}`}</td>
                <td className="d-none d-sm-table-cell" style={{ width: "10%" }}>
                  {tournament.prestige}
                </td>
                <td style={{ width: "30%" }}>{tournament.place}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
}

export default TournamnetsByCategoryCard;
