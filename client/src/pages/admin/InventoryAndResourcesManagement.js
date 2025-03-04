import React, { useState, useEffect } from "react";

const inStockData = [
  { drug: "Nathasha", quantity: "00", expDate: "2024/10/04" },
  { drug: "Nathasha", quantity: "00", expDate: "2024/10/04" },
  { drug: "Thathsara", quantity: "00", expDate: "2024/10/04" },
  { drug: "Thathsara", quantity: "00", expDate: "2024/10/04" },
];

const outOfStockData = ["Nathasha", "Thathsara", "Nathasha", "Nathasha"];

const inOrderData = [
  { drug: "Belani", quantity: "00", arrivalDate: "2024/10/04" },
  { drug: "Vidusahan", quantity: "00", arrivalDate: "2024/10/04" },
  { drug: "Nuhansa", quantity: "00", arrivalDate: "2024/10/04" },
  { drug: "Ashinshana", quantity: "00", arrivalDate: "2024/10/04" },
];

const equipment = [
  { equipmentName: "Thathsara", quantity: "00", free: "00" },
  { equipmentName: "Thathsara", quantity: "00", free: "00" },
  { equipmentName: "Nathasha", quantity: "00", free: "00" },
  { equipmentName: "Nathasha", quantity: "00", free: "00" },
];

function InventoryAndResourcesManagement() {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Inventory & Resources Management</h3>
        <p
          className="px-3 py-2 rounded"
          style={{ backgroundColor: "#bacae7", textAlign: "center" }}
        >
          {dateTime}
        </p>
      </div>

      {/* All Sections Container */}
      <div className="d-flex flex-column align-items-center justify-content-center">
        
        {/* In Stock Section */}
        <div className="col-10 col-md-8 col-lg-6 mb-4 text-center">
          <h5>In Stock</h5>
          <div className="p-2 bg-secondary text-white fw-bold">
            <div className="row">
              <div className="col">Drug Name</div>
              <div className="col">Quantity</div>
              <div className="col">Exp. Date</div>
            </div>
          </div>
          {inStockData.map((item, index) => (
            <div key={index} className="p-2 my-2 bg-light border rounded">
              <div className="row">
                <div className="col">{item.drug}</div>
                <div className="col">{item.quantity}</div>
                <div className="col">{item.expDate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Out of Stock Section */}
        <div className="col-10 col-md-8 col-lg-6 mb-4 text-center">
          <h5>Out of Stock</h5>
          <div className="p-2 bg-secondary text-white fw-bold">
            <div className="row">
              <div className="col">Drug Name</div>
            </div>
          </div>
          {outOfStockData.map((drug, index) => (
            <div key={index} className="p-2 my-2 bg-light border rounded">
              {drug}
            </div>
          ))}
        </div>

        {/* In Order Section */}
        <div className="col-10 col-md-8 col-lg-6 mb-4 text-center">
          <h5>In Order</h5>
          <div className="p-2 bg-secondary text-white fw-bold">
            <div className="row">
              <div className="col">Drug Name</div>
              <div className="col">Quantity</div>
              <div className="col">Arrival Date</div>
            </div>
          </div>
          {inOrderData.map((item, index) => (
            <div key={index} className="p-2 my-2 bg-light border rounded">
              <div className="row">
                <div className="col">{item.drug}</div>
                <div className="col">{item.quantity}</div>
                <div className="col">{item.arrivalDate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Equipment Section */}
        <div className="col-10 col-md-8 col-lg-6 mb-4 text-center">
          <h5>Equipment</h5>
          <div className="p-2 bg-secondary text-white fw-bold">
            <div className="row">
              <div className="col">Equipment Name</div>
              <div className="col">Quantity</div>
              <div className="col">Free</div>
            </div>
          </div>
          {equipment.map((item, index) => (
            <div key={index} className="p-2 my-2 bg-light border rounded">
              <div className="row">
                <div className="col">{item.equipmentName}</div>
                <div className="col">{item.quantity}</div>
                <div className="col">{item.free}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default InventoryAndResourcesManagement;
