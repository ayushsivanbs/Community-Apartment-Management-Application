import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Video from "react-native-video";
import axios from "axios";

const API_URL = "http://192.168.51.89:5000/maintenance_requests"; // Replace with your API URL

const ComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, priorityFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setComplaints(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    if (priorityFilter === "All") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter((item) => item.priority === priorityFilter));
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [requestId]: true }));
      await axios.put(`${API_URL}/${requestId}`, { status });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.request_id === requestId ? { ...complaint, status } : complaint
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update status. Try again later.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.text}>
        Priority: <Text style={[styles.bold, getPriorityStyle(item.priority)]}>{item.priority}</Text>
      </Text>
      <Text style={styles.text}>Status: <Text style={styles.bold}>{item.status}</Text></Text>
      <Text style={styles.text}>Description: {item.description}</Text>

      {item.media?.length > 0 && (
        <FlatList
          data={item.media}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: mediaItem }) => {
            // Replace backslashes with forward slashes
            const mediaUrl = mediaItem.media_url.replace("\\", "/"); 
            const isVideo = mediaItem.media_type === "Video";

            return isVideo ? (
              <Video
                source={{ uri: mediaUrl }}
                style={styles.video}
                resizeMode="cover"
                controls
              />
            ) : (
              <Image source={{ uri: mediaUrl }} style={styles.media} />
            );
          }}
          keyExtractor={(mediaItem) => mediaItem.media_id.toString()}
        />
      )}

      <View style={styles.pickerContainer}>
        {updatingStatus[item.request_id] ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Picker
            selectedValue={item.status}
            style={styles.picker}
            onValueChange={(value) => updateStatus(item.request_id, value)}
          >
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="In Progress" value="In Progress" />
            <Picker.Item label="Completed" value="Completed" />
            <Picker.Item label="Rejected" value="Rejected" />
          </Picker>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance Requests</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Priority:</Text>
        <Picker
          selectedValue={priorityFilter}
          style={styles.filterPicker}
          onValueChange={(value) => setPriorityFilter(value)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredComplaints.length > 0 ? (
        <FlatList
          data={filteredComplaints}
          renderItem={renderItem}
          keyExtractor={(item) => item.request_id.toString()}
        />
      ) : (
        <Text style={styles.noDataText}>No complaints found for this priority.</Text>
      )}
    </View>
  );
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":
      return { color: "red", fontWeight: "bold" };
    case "Medium":
      return { color: "orange", fontWeight: "bold" };
    case "Low":
      return { color: "green", fontWeight: "bold" };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: {
    padding: 16, backgroundColor: "#fff", marginBottom: 12, borderRadius: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3
  },
  subject: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 14, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  media: { width: 120, height: 120, marginTop: 10, marginRight: 5, borderRadius: 5 },
  video: { width: 200, height: 120, marginTop: 10, marginRight: 5, borderRadius: 5 },
  pickerContainer: { marginTop: 10, backgroundColor: "#ddd", borderRadius: 5 },
  picker: { height: 55, width: "100%", color: "#000", backgroundColor: "#fff" },
  filterContainer: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 15, backgroundColor: "#fff",
    padding: 10, borderRadius: 10, elevation: 2
  },
  filterLabel: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  filterPicker: { flex: 1, height: 55, color: "#000", backgroundColor: "#fff" },
  noDataText: { fontSize: 16, textAlign: "center", color: "#555", marginTop: 20 }
});

export default ComplaintsScreen;
