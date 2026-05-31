import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabase';
import { MessageCircle, Plus, Search, ChevronRight, Clock, User, Link2, Paperclip, Send, X, FileText, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import { SPECIALTIES } from '../constants';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  specialty: string;
  author_id: string;
  author_name: string;
  case_id?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
  reply_count?: number;
  likes_count?: number;
}

interface ForumReply {
  id: string;
  post_id: string;
  content: string;
  author_id: string;
  author_name: string;
  attachments: string[];
  created_at: string;
}

interface Props {
  onBackToDashboard?: () => void;
}

const Forum: React.FC<Props> = ({ onBackToDashboard }) => {
  const { currentUser, cases } = useApp();
  const [activeView, setActiveView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    specialty: currentUser?.specialty || 'General Medicine',
    case_id: '',
    attachments: [] as string[]
  });

  useEffect(() => {
    fetchPosts();
  }, [selectedSpecialty, searchQuery]);

  useEffect(() => {
    if (selectedPost) {
      fetchReplies(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedSpecialty !== 'all') {
        query = query.eq('specialty', selectedSpecialty);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch reply counts and likes
      const postsWithCounts = await Promise.all(
        (data || []).map(async (post) => {
          const { count: replyCount } = await supabase
            .from('forum_replies')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          const { count: likesCount } = await supabase
            .from('forum_post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return {
            ...post,
            reply_count: replyCount || 0,
            likes_count: likesCount || 0
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          specialty: newPost.specialty,
          author_id: currentUser.id,
          author_name: currentUser.name,
          case_id: newPost.case_id || null,
          attachments: newPost.attachments
        })
        .select()
        .single();

      if (error) throw error;

      setNewPost({
        title: '',
        content: '',
        specialty: currentUser.specialty || 'General Medicine',
        case_id: '',
        attachments: []
      });

      setActiveView('list');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedPost) return;

    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: selectedPost.id,
          content: replyContent,
          author_id: currentUser.id,
          author_name: currentUser.name,
          attachments: []
        });

      if (error) throw error;

      setReplyContent('');
      fetchReplies(selectedPost.id);
      fetchPosts(); // Update reply count
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to post reply. Please try again.');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', currentUser.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id);
      } else {
        // Like
        await supabase
          .from('forum_post_likes')
          .insert({
            post_id: postId,
            user_id: currentUser.id
          });
      }

      fetchPosts();
      if (selectedPost?.id === postId) {
        const updatedPost = posts.find(p => p.id === postId);
        if (updatedPost) {
          setSelectedPost({
            ...selectedPost,
            likes_count: existingLike ? (selectedPost.likes_count || 1) - 1 : (selectedPost.likes_count || 0) + 1
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      'Cardiology': 'bg-red-100 text-red-700 border-red-200',
      'Dermatology': 'bg-pink-100 text-pink-700 border-pink-200',
      'Neurology': 'bg-blue-100 text-blue-700 border-blue-200',
      'Oncology': 'bg-purple-100 text-purple-700 border-purple-200',
      'Pediatrics': 'bg-green-100 text-green-700 border-green-200',
      'Orthopedics': 'bg-orange-100 text-orange-700 border-orange-200',
      'Psychiatry': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'General Medicine': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[specialty] || colors['General Medicine'];
  };

  const linkedCase = selectedPost?.case_id ? cases.find(c => c.id === selectedPost.case_id) : null;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {activeView === 'detail' && (
            <button
              onClick={() => {
                setActiveView('list');
                setSelectedPost(null);
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary-600" />
            <h1 className="text-xl font-bold text-slate-900">Doctor Forum</h1>
          </div>
        </div>
        {activeView === 'list' && (
          <button
            onClick={() => setActiveView('create')}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Discussion
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeView === 'list' && (
          <div className="max-w-6xl mx-auto p-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="all">All Specialties</option>
                  {SPECIALTIES.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-slate-500 mt-4">Loading discussions...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No discussions yet</h3>
                <p className="text-slate-500 mb-6">Be the first to start a discussion in your specialty!</p>
                <button
                  onClick={() => setActiveView('create')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                >
                  Start a Discussion
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      setActiveView('detail');
                    }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSpecialtyColor(post.specialty)}`}>
                            {post.specialty}
                          </span>
                          {post.case_id && (
                            <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                              <Link2 className="h-3 w-3" />
                              Linked Case
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2">{post.content}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Dr. {post.author_name.split(' ').pop()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.reply_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'create' && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Start a New Discussion</h2>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter a descriptive title..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={newPost.specialty}
                    onChange={(e) => setNewPost({ ...newPost, specialty: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    {SPECIALTIES.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Describe the case, ask questions, or share your thoughts..."
                    rows={8}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link to Case (Optional)
                  </label>
                  <select
                    value={newPost.case_id}
                    onChange={(e) => setNewPost({ ...newPost, case_id: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value="">No linked case</option>
                    {cases
                      .filter(c => c.specialty === newPost.specialty)
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.patientName} - {c.symptoms.substring(0, 50)}...
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveView('list')}
                    className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newPost.title || !newPost.content}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeView === 'detail' && selectedPost && (
          <div className="max-w-4xl mx-auto p-6">
            {/* Post Detail */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSpecialtyColor(selectedPost.specialty)}`}>
                  {selectedPost.specialty}
                </span>
                {selectedPost.case_id && (
                  <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                    <Link2 className="h-3 w-3" />
                    Linked Case
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedPost.title}</h2>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Dr. {selectedPost.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(selectedPost.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="prose prose-slate max-w-none mb-6">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {linkedCase && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-2">
                    <FileText className="h-4 w-4" />
                    Linked Case
                  </div>
                  <p className="text-sm text-slate-700"><strong>Patient:</strong> {linkedCase.patientName}</p>
                  <p className="text-sm text-slate-700 mt-1"><strong>Symptoms:</strong> {linkedCase.symptoms}</p>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleLikePost(selectedPost.id)}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition"
                >
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">{selectedPost.likes_count || 0}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-600">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">{selectedPost.reply_count || 0} replies</span>
                </div>
              </div>
            </div>

            {/* Replies */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="font-bold text-slate-900 mb-4">Replies</h3>
              {replies.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No replies yet. Be the first to respond!</p>
              ) : (
                <div className="space-y-4">
                  {replies.map(reply => (
                    <div key={reply.id} className="border-l-4 border-primary-200 pl-4 py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-slate-900">Dr. {reply.author_name.split(' ').pop()}</span>
                        <span className="text-xs text-slate-500">{new Date(reply.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Form */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <form onSubmit={handleCreateReply}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Add Your Reply
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your insights, ask clarifying questions, or provide feedback..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none mb-4"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!replyContent}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    Post Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
