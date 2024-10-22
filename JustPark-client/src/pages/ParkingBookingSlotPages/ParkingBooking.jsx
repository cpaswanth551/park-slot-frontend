import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import {
  create_Checkout_Session,
  create_bookingSlot_byuser,
  getParkSlotbyId,
  getParkingSLotby_PlaceId_SlotNumber,
} from "../../utils/Constants";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ParkingBooking = () => {
  const navigate = useNavigate();
  const { placeId, slotNumber } = useParams();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.client);
  const [parkingSlot, setParkingSlot] = useState({});

  const handleError = (error) => {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : "Network error. Please try again later.";
    toast.error(errorMessage, {
      position: "top-right",
    });
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    try {
      await handlecohCheckout();
    } catch (error) {
      handleError(error);
    }
  };

  const handlecohCheckout = async () => {
    try {
      const formData = {
        user_id: user.id,
        slot_id: parkingSlot.id,
        time_reserved: document.getElementById("parking-time").value,
        phone_number: document.getElementById("phone-number").value,
      };
      await axios.post(`${create_bookingSlot_byuser}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
      toast.success("Booking Successful!", { position: "top-right" });
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    axios
      .get(`${getParkingSLotby_PlaceId_SlotNumber}${slotNumber}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setParkingSlot(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parking slots:", error);
      });
  }, []);

  return (
    <>
      {/* Left side: Booking Form */}
      <div className="m-5 min-h-[600px]">
        {parkingSlot.place && (
          <form
            className="max-w-3xl mx-auto p-4 rounded shadow-xl w-90%"
            onSubmit={handleCheckout}
          >
            {/* Form elements */}
            <div className="px-4 sm:px-0">
              <h3 className="text-xl font-semibold leading-7 text-gray-900">
                Applicant Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                phone details and application.
              </p>
            </div>

            <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 mb-5 border-b border-gray-300">
              <div className="flex flex-col py-3 border-b border-gray-300">
                <dt className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Plot name
                </dt>
                <dd className="text-gray-500 text-sm">
                  {parkingSlot.place.name}
                </dd>
              </div>
              <div className="flex flex-col py-3 border-b border-gray-300">
                <dt className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Slot Number
                </dt>
                <dd className="text-gray-500 text-sm">
                  {parkingSlot.slot_number}
                </dd>
              </div>
              <div className="flex flex-col py-3 border-b border-gray-300">
                <dt className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Address
                </dt>
                <dd className="text-gray-500 text-sm">
                  {parkingSlot.place.address}
                </dd>
              </div>
            </dl>

            <div className="mb-6">
              <label
                htmlFor="phone-number"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone-number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="9876543210"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="parking-time"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Parking Hours
              </label>
              <input
                type="text"
                id="parking-time"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="2"
                required
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
            >
              Book
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ParkingBooking;
