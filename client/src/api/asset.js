import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Uploads a new asset along with its files.
 * @param {FormData} formData – multipart form data containing 'metadata' and file blobs.
 * @returns {Promise<AxiosResponse>} the server response
 */
export const createAsset = async (formData) => {
  return axios.post(
    `${API_BASE_URL}/assets`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

/**
 * Fetches a single asset by group and asset name.
 * @param {string} groupName – name of the group (e.g. "electronics")
 * @param {string} assetName – name of the asset
 * @returns {Promise<object>} the complete asset object with files
 */
export const getAsset = async (groupName, assetName) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/assets/${groupName}/${assetName}`
  );

  return {
    ...data,
    // JSON key from backend is "group" (array of strings)
    group: Array.isArray(data.group) && data.group.length > 0
      ? data.group[0]
      : "",
    // JSON key from backend is "files" (array of objects)
    files: Array.isArray(data.files)
      ? data.files.map(file => ({
          // use exactly the JSON field names
          filename: file.filename,
          type:     file.type,
          typeValue:file.typeValue,
          fileUrl:  file.fileUrl || `http://localhost:8080/uploads/${file.filename}`
        }))
      : []
  };
};

/**
 * Fetches all assets in the given group.
 * @param {string} groupName – name of the group (e.g. "Electronics")
 * @returns {Promise<object[]>} array of asset objects
 */
export const getAssetsByGroup = async (groupName) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/assets/group/${encodeURIComponent(groupName)}`
  );

  return data.assets.map(asset => ({
    ...asset,
    group: Array.isArray(asset.group) && asset.group.length > 0
      ? asset.group[0]
      : ""
  }));
};

/**
 * Downloads a file from the server.
 * @param {string} filePath – the file path returned by backend (e.g. "/uploads/filename.ext" or full URL)
 * @returns {Promise<AxiosResponse>} the file response
 */
export const downloadFile = async (filePath) => {
  // if the backend already returned a full URL, axios will handle it
  const url = filePath.startsWith("http")
    ? filePath
    : `http://localhost:8080${filePath}`;
  return axios.get(url, {
    responseType: 'blob'
  });
};

/**
 * Deletes an asset by its ID.
 * @param {number|string} id – the asset's database ID
 * @returns {Promise<AxiosResponse>} the server response
 */
export const deleteAsset = async (id) => {
  return axios.delete(`${API_BASE_URL}/assets/${id}`);
};
