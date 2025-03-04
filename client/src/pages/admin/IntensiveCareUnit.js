import React,{useState, useEffect} from "react";



const styles = {
  card: {
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#F0F0F0",
  },
  sectionHeader: {
    backgroundColor: "#B0A5A5",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: "5px",
  },
  tableHeader: {
    backgroundColor: "#A39494",
    color: "white",
    padding: "10px",
    fontWeight: "bold",
  },
  tableRow: {
    backgroundColor: "#E5E5E5",
    padding: "10px",
  },
};

const dummyData = {
  bedsOccupied: 15,
  bedsFree: 10,
  totalDischarged: 8,
  totalAdmitted: 12,
  transferred: 5,
  totalCapacity: 25,
  doctors: ["Dr. John Doe", "Dr. Alice Smith"],
  nurses: ["Nurse 1", "Nurse 2", "Nurse 3"],
  equipment: [
    { name: "Thathsara", quantity: "00", free: "00" },
    { name: "Thathsara", quantity: "00", free: "00" },
    { name: "Thathsara", quantity: "00", free: "00" },
    { name: "Thathsara", quantity: "00", free: "00" },
  ],
};

const HospitalDashboard = () => {

  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDateTime(new Date().toLocaleString());
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);

  return (
    <div className="container-fluid p-4">
      {/* Top Row */}
      <div className="row mb-4 text-center">
        <div className="col-md-6">
          <div className="p-3" style={styles.card}>
          <p
          className="px-3 py-2 rounded"
          style={{ backgroundColor: "#bacae7", textAlign: "center" }}
        >
          {dateTime}
        </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3" style={styles.card}>
            <h5>Total capacity - {dummyData.totalCapacity}</h5>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="row mb-4">
        {/* Beds Information */}
        <div className="col-md-4">
          <div style={styles.card}>
            <h6>Beds occupied - {dummyData.bedsOccupied}</h6>
            <h6>Beds free - {dummyData.bedsFree}</h6>
          </div>
        </div>

        {/* Admissions and Transfers */}
        <div className="col-md-4">
          <div style={styles.card}>
            <h6>Total discharged - {dummyData.totalDischarged}</h6>
            <h6>Total admitted - {dummyData.totalAdmitted}</h6>
            <h6>Transferred - {dummyData.transferred}</h6>
          </div>
        </div>

        {/* Doctor & Nurse Shift Info */}
        <div className="col-md-4">
          <div style={styles.card}>
            <h6>Doctor in charge for the shift</h6>
            {dummyData.doctors.map((doc, index) => (
              <p key={index} className="mb-1">{doc}</p>
            ))}
            <h6>Nurses</h6>
            {dummyData.nurses.map((nurse, index) => (
              <p key={index} className="mb-1">{nurse}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div>
        <h5 className="mb-3">Equipments</h5>
        <div className="table-responsive">
          <table className="table text-center">
            <thead>
              <tr style={styles.tableHeader}>
                <th>Equipment Name</th>
                <th>Quantity</th>
                <th>Free</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.equipment.map((item, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.free}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;

