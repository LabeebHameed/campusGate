import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface ApplicationType {
  id: string;
  college: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

const applications: ApplicationType[] = [
  {
    id: '1',
    college: 'Kerala College',
    course: 'Computer Science',
    status: 'pending',
    appliedDate: '2024-01-15'
  },
  {
    id: '2',
    college: 'KTU College',
    course: 'Information Technology',
    status: 'approved',
    appliedDate: '2024-01-10'
  },
  {
    id: '3',
    college: 'MG College',
    course: 'Electronics',
    status: 'rejected',
    appliedDate: '2024-01-05'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-yellow-600 bg-yellow-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return 'check-circle';
    case 'rejected':
      return 'x-circle';
    default:
      return 'clock';
  }
};

export default function ApplicationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">My Applications</Text>
        <Text className="text-gray-500 mt-1">{applications.length} applications submitted</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-3">
          {applications.map((application) => (
            <TouchableOpacity
              key={application.id}
              className="bg-white p-4 rounded-xl border border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {application.college} - {application.course}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Applied on {new Date(application.appliedDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
                  <Feather name={getStatusIcon(application.status) as any} size={14} />
                  <Text className="ml-1 text-xs font-medium capitalize">
                    {application.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <TouchableOpacity className="flex-row items-center">
                  <Feather name="eye" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 text-sm">View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="flex-row items-center">
                  <Feather name="download" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 text-sm">Download</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {applications.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Feather name="file-text" size={48} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-500 mt-4">No Applications Yet</Text>
            <Text className="text-sm text-gray-400 mt-2 text-center px-8">
              Start by exploring colleges and applying to your preferred courses
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
