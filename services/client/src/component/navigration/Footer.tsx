import { LinkItem } from "./LinkItem";

export const Footer = () => {
    return (
        <div className="mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} My Company</p>
            <ul className="flex space-x-6">
                <LinkItem href="/privacy" text="Privacy" />
                <LinkItem href="/terms" text="Terms" />
            </ul>
            </div>
            <p className="text-sm text-gray-500">
            This website is for demonstration purposes only.
            </p>
        </div>
    );
}