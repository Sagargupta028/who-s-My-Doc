import { API_ENDPOINTS } from './config/api';

if(formData.location!='hulu'){
    axios.post(API_ENDPOINTS.PATIENT.FIND_DOCTOR, formData).then((result)=>{
      console.log(result.data)
      setFilteredDoctors(result.data)
    }).catch((error)=>{
      console.log(error)
    })
  }

  const fetchlocations = async () => {
    await axios.get(`${API_ENDPOINTS.PATIENT.GET_LOCATIONS || API_ENDPOINTS.LOCATIONS}`).then((result) => {
      console.log(result.data)
      setLocation(result.data)
    }).catch((error) => {
      console.log(error)
    })
  }