import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

import { Link, useParams } from "react-router-dom";
import { get_parkingPlace } from "../../utils/Constants";

const ParkingSlot = () => {
  const { id } = useParams();

  const [parkingslots, setParkingslots] = useState([]);
  useEffect(() => {
    axios
      .get(`${get_parkingPlace}/${id}/`)
      .then((response) => {
        setParkingslots(response.data.slots);
      })
      .catch((error) => console.error("Error fetching parking lots:", error));
  }, []);
  const rows = [];
  const columns = 2;

  for (let i = 0; i < parkingslots.length; i += columns) {
    rows.push(parkingslots.slice(i, i + columns));
  }
  return (
    <div className="h-[700px] m-3">
      <div className="grid-container grid grid-cols-2 gap-4 p-4 m-6">
        {rows.map((row, rowIndex) => (
          <div className="grid-row flex" key={rowIndex}>
            {row.map((slot, columnIndex) => (
              <div
                className={`grid-item p-4 border flex-grow ${
                  slot.is_booked ? "bg-red-500 text-white" : "bg-green-500"
                }`}
                key={columnIndex}
              >
                {slot.is_booked ? (
                  <span>{slot.slot_number}</span>
                ) : (
                  <Link
                    to={`/booking/${id}/${slot.slot_number}`}
                    className="text-white"
                  >
                    {slot.slot_number}
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingSlot;
