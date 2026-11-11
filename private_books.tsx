import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { DarkColors, Spacing, BorderRadius, FontSizes } from '../constants/theme';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Document {
  document_id: string;
  title: string;
  file_type: string;
  tags: string[];
  current_page: number;
  total_pages: number;
  last_read_at?: string;
}

export default function PrivateBooksScreen() {
  const { sessionToken } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivateDocuments();
  }, []);

  const fetchPrivateDocuments = async () => {
    try {
      const headers = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
      const response = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers,
        params: { is_private: true },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch private documents:', error);
      Alert.alert('Error', 'Failed to load private books');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    Alert.alert(
      'Delete Private Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const headers = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
              await axios.delete(`${BACKEND_URL}/api/documents/${documentId}`, { headers });
              fetchPrivateDocuments();
            } catch (error) {
              console.error('Failed to delete:', error);
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return null;
    }
  };

  const renderDocument = ({ item }: { item: Document }) => {
    const timeAgo = getTimeAgo(item.last_read_at);
    const autoTag = item.tags[0] || 'Document';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/reader/${item.document_id}`)}
      >
        <View style={styles.icon}>
          <Ionicons
            name={item.file_type === 'pdf' ? 'document-text' : 'document'}
            size={32}
            color={DarkColors.primary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.autoTag}>
              <Text style={styles.autoTagText}>{autoTag}</Text>
            </View>
            {timeAgo && <Text style={styles.timeAgo}>{timeAgo}</Text>}
          </View>
          {item.total_pages > 0 && (
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(item.current_page / item.total_pages) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.pageText}>
                {item.current_page}/{item.total_pages}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => deleteDocument(item.document_id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color={DarkColors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Private Books',
          headerStyle: {
            backgroundColor: DarkColors.surface,
          },
          headerTintColor: DarkColors.text,
          headerTitleStyle: {
            fontSize: FontSizes.title,
            fontWeight: '700',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: Platform.OS === 'ios' ? 0 : 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={DarkColors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={20} color={DarkColors.primary} />
        </View>
        <Text style={styles.headerSubtitle}>
          Your private collection • {documents.length} {documents.length === 1 ? 'book' : 'books'}
        </Text>
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.document_id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="lock-closed-outline" size={64} color={DarkColors.textTertiary} />
            <Text style={styles.emptyText}>No private books yet</Text>
            <Text style={styles.emptySubtext}>
              Add books to Private Space from the Library
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkColors.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: DarkColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: DarkColors.border,
    alignItems: 'center',
  },
  lockBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DarkColors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: DarkColors.textSecondary,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: DarkColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: DarkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DarkColors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: DarkColors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  autoTag: {
    backgroundColor: DarkColors.backgroundTertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  autoTagText: {
    fontSize: FontSizes.xs,
    color: DarkColors.textSecondary,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: FontSizes.xs,
    color: DarkColors.textTertiary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: DarkColors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: DarkColors.readingProgress,
  },
  pageText: {
    fontSize: FontSizes.xs,
    color: DarkColors.textSecondary,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: Spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: DarkColors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    color: DarkColors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
