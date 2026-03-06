import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContractById } from "../../services/contract/ContractService";

const ContractDetail = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      const res = await getContractById(id);
      setContract(res.data);
    };

    fetchContract();
  }, [id]);

  if (!contract) return <p>Loading...</p>;

  return (
    <div>
      <h2>Chi tiết hợp đồng</h2>
      <p>ID: {contract.contractId}</p>
      <p>Loại hợp đồng: {contract.contractType}</p>
      <p>Ngày ký: {contract.signDate}</p>
      <p>Ngày hết hạn: {contract.endDate}</p>
    </div>
  );
};

export default ContractDetail;