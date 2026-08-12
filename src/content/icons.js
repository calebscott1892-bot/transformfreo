import {
    Book,
    BookOpen,
    Building2,
    Calendar,
    Church,
    Crown,
    Facebook,
    Globe,
    Handshake,
    Heart,
    Home,
    Instagram,
    Lightbulb,
    Mail,
    MapPin,
    MessageCircle,
    Music,
    Phone,
    Sparkles,
    Sun,
    Users,
    Youtube
} from 'lucide-react';

// Icon names here are what appear in the CMS dropdowns. Adding an icon is a
// two-step job: add it to this map, then add the same name to the matching
// `options:` list in public/admin/config.yml.
export const ICONS = {
    book: Book,
    bookOpen: BookOpen,
    building: Building2,
    calendar: Calendar,
    church: Church,
    crown: Crown,
    facebook: Facebook,
    globe: Globe,
    handshake: Handshake,
    heart: Heart,
    home: Home,
    instagram: Instagram,
    lightbulb: Lightbulb,
    mail: Mail,
    mapPin: MapPin,
    messageCircle: MessageCircle,
    music: Music,
    phone: Phone,
    sparkles: Sparkles,
    sun: Sun,
    users: Users,
    youtube: Youtube
};

export function getIcon(name, fallback = Sparkles) {
    return ICONS[name] || fallback;
}
